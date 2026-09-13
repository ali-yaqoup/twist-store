import { createClient } from "@/lib/supabase/server";

export type AdminCapabilityReport = {
  signedIn: boolean;
  isAdmin: boolean;
  claimOk: boolean;
  canReadProducts: boolean;
  canUpdateOrderItems: boolean;
  deleteRpcAvailable: boolean;
  deleteTriggerFixed: boolean | null;
  notes: string[];
};

/** Non-destructive checks for admin write paths (safe during RSC). */
export async function diagnoseAdminCapabilities(): Promise<AdminCapabilityReport> {
  const notes: string[] = [];
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      signedIn: false,
      isAdmin: false,
      claimOk: false,
      canReadProducts: false,
      canUpdateOrderItems: false,
      deleteRpcAvailable: false,
      deleteTriggerFixed: null,
      notes: ["يجب تسجيل الدخول كأدمن."],
    };
  }

  const { error: claimError } = await supabase.rpc("claim_admin_identity");
  const claimOk = !claimError;
  if (claimError) notes.push(`claim_admin_identity: ${claimError.message}`);

  const { data: adminRow } = await supabase.from("admins").select("id, email, user_id").maybeSingle();
  const isAdmin = Boolean(adminRow);
  if (!isAdmin) notes.push("لا يوجد صف أدمن مرتبط بهذا الحساب.");
  if (adminRow && !adminRow.user_id) {
    notes.push("admins.user_id فارغ — شغّل claim أو اربط user_id يدوياً.");
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id")
    .limit(1);
  const canReadProducts = !productsError;
  if (productsError) notes.push(`قراءة المنتجات: ${productsError.message}`);

  // Probe UPDATE policy without changing data (filter that matches nothing).
  const { error: orderItemUpdateError } = await supabase
    .from("order_items")
    .update({ product_id: null })
    .eq("id", "00000000-0000-0000-0000-000000000000");
  const canUpdateOrderItems =
    !orderItemUpdateError ||
    // "0 rows" is fine; permission / trigger errors are not.
    !/permission|policy|invalid product|not authorized/i.test(orderItemUpdateError.message);
  if (orderItemUpdateError && !canUpdateOrderItems) {
    notes.push(`تحديث order_items: ${orderItemUpdateError.message}`);
  }

  const { error: rpcMissingError } = await supabase.rpc("admin_delete_product", {
    p_id: "00000000-0000-0000-0000-000000000000",
  });
  const deleteRpcAvailable =
    !rpcMissingError ||
    !/could not find the function|PGRST202|404/i.test(rpcMissingError.message ?? "");
  if (!deleteRpcAvailable) {
    notes.push("دالة admin_delete_product غير موجودة — شغّل 0008/0009.");
  } else if (rpcMissingError && /invalid product/i.test(rpcMissingError.message)) {
    notes.push("تريغر الأسعار ما زال يمنع فصل المنتج — شغّل 0009.");
  }

  let deleteTriggerFixed: boolean | null = null;
  if (deleteRpcAvailable) {
    // product not found / not authorized means trigger allowed null detach path.
    if (!rpcMissingError || /not found|not authorized/i.test(rpcMissingError.message)) {
      deleteTriggerFixed = true;
    } else if (/invalid product/i.test(rpcMissingError.message)) {
      deleteTriggerFixed = false;
    }
  }

  if (isAdmin && deleteRpcAvailable && deleteTriggerFixed !== false) {
    notes.push("صلاحيات الأدمن ومسار الحذف يبدوان جاهزين.");
  }

  return {
    signedIn: true,
    isAdmin,
    claimOk,
    canReadProducts,
    canUpdateOrderItems,
    deleteRpcAvailable,
    deleteTriggerFixed,
    notes,
  };
}
