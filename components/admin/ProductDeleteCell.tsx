"use client";

import DeleteButton from "@/components/admin/DeleteButton";
import { deleteProduct } from "@/app/admin/actions";

export default function ProductDeleteCell({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  return (
    <DeleteButton
      confirmText={`هل أنت متأكد من حذف «${productName}»؟`}
      onDelete={() => deleteProduct(productId)}
    />
  );
}
