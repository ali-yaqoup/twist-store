-- ============================================================
-- TWIST Store — بيانات أولية (فئات + منتجات + معرض)
-- ============================================================

insert into public.categories (name, slug) values
  ('تيشيرتات', 'tshirts'),
  ('هوديز', 'hoodies'),
  ('يونيفورم', 'uniforms'),
  ('قبعات', 'caps'),
  ('بولو', 'polo')
on conflict (slug) do nothing;

insert into public.products (
  name, description, price, category_id, images, sizes, colors, embroidery_or_print_type, is_active
)
select v.name, v.description, v.price, c.id, v.images, v.sizes, v.colors, v.service, true
from (
  values
    (
      'تيشيرت قطن كلاسيك',
      'تيشيرت قطن 100٪ بوزن متوسط ولمسة ناعمة. مثالي لتطريز الشعار على الصدر أو طباعة التصميم على الظهر.',
      79::numeric,
      'tshirts',
      array[
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80'
      ],
      array['S','M','L','XL','XXL'],
      array['أسود','أبيض','كحلي'],
      'both'
    ),
    (
      'تيشيرت أسود أوفرسايز',
      'قصة واسعة عصرية بكتف ساقط. مثالي للطباعة DTF أو السلك سكرين على مساحة كبيرة.',
      89::numeric,
      'tshirts',
      array[
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80'
      ],
      array['M','L','XL','XXL'],
      array['أسود','رمادي'],
      'print'
    ),
    (
      'تيشيرت طباعة فنية',
      'قطعة جاهزة لتطبيق تصميمك الفني على الصدر أو كامل الواجهة. طباعة عالية الدقة تثبت مع الغسيل.',
      95::numeric,
      'tshirts',
      array[
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80'
      ],
      array['S','M','L','XL'],
      array['أبيض','أسود','رمادي'],
      'print'
    ),
    (
      'هودي شتوي فاخر',
      'هودي ببطانة داخلية دافئة وجيب كنغر. التطريز ثلاثي الأبعاد على الصدر يعطي نتيجة براند راقية.',
      149::numeric,
      'hoodies',
      array[
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80'
      ],
      array['S','M','L','XL','XXL'],
      array['أسود','كحلي','رمادي'],
      'embroidery'
    ),
    (
      'هودي خفيف',
      'هودي خفيف مناسب للربيع والخريف. يمكن تطريز الاسم أو طباعة شعار الفريق على الصدر والكم.',
      129::numeric,
      'hoodies',
      array[
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80'
      ],
      array['S','M','L','XL'],
      array['أسود','أبيض','رمادي'],
      'both'
    ),
    (
      'سويت شيرت رقبة دائرية',
      'سويت شيرت بدون قبعة، قصة مريحة. مساحة واسعة للطباعة على الصدر والظهر.',
      119::numeric,
      'hoodies',
      array[
        'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80'
      ],
      array['S','M','L','XL','XXL'],
      array['أسود','رمادي','كحلي'],
      'print'
    ),
    (
      'قميص يونيفورم شركات',
      'قميص عملي بأكمام طويلة وجيب صدر. جاهز لتطريز شعار الشركة بالخيط الذهبي.',
      99::numeric,
      'uniforms',
      array[
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80'
      ],
      array['M','L','XL','XXL'],
      array['كحلي','أسود','أبيض'],
      'embroidery'
    ),
    (
      'جاكيت يونيفورم خفيف',
      'جاكيت خفيف للفرق الميدانية والشركات. مساحة واسعة على الظهر والصدر للتطريز أو الطباعة.',
      179::numeric,
      'uniforms',
      array[
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80'
      ],
      array['M','L','XL','XXL'],
      array['أسود','كحلي'],
      'both'
    ),
    (
      'طقم يونيفورم فريق',
      'طقم متكامل لفرق العمل. نطرّز الشعار بشكل موحّد على كل القطع لنفس الهوية البصرية.',
      199::numeric,
      'uniforms',
      array[
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80'
      ],
      array['M','L','XL','XXL'],
      array['كحلي','أسود'],
      'embroidery'
    ),
    (
      'بولو قطن فاخر',
      'بولو بياقة كلاسيكية. القطعة الأكثر طلباً للفرق واليونيفورم اليومي.',
      89::numeric,
      'polo',
      array[
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=900&q=80'
      ],
      array['S','M','L','XL','XXL'],
      array['أسود','أبيض','كحلي','أحمر'],
      'both'
    ),
    (
      'قبعة سناب باك',
      'قبعة قابلة للتعديل مع مساحة أمامية مثالية للتطريز ثلاثي الأبعاد.',
      59::numeric,
      'caps',
      array[
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80'
      ],
      array['حر'],
      array['أسود','كحلي','أبيض'],
      'embroidery'
    ),
    (
      'كاب بيسبول تطريز 3D',
      'كاب كلاسيكي بتطريز بارز على الواجهة. ننفّذ شعارك أو اسمك بغرز كثيفة.',
      69::numeric,
      'caps',
      array[
        'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80'
      ],
      array['حر'],
      array['أسود','ذهبي','كحلي'],
      'embroidery'
    )
) as v(name, description, price, cat_slug, images, sizes, colors, service)
join public.categories c on c.slug = v.cat_slug
where not exists (
  select 1 from public.products p where p.name = v.name
);

insert into public.gallery_images (image_url, caption)
select v.image_url, v.caption
from (
  values
    ('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80', 'طباعة تيشيرتات لفعالية شبابية'),
    ('https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80', 'تطريز يدوي وتفاصيل دقيقة على القماش'),
    ('https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80', 'هودي أسود بتطريز شعار على الصدر'),
    ('https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80', 'بولو شركات بهوية موحّدة'),
    ('https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80', 'قبعات مطرّزة لفريق كامل'),
    ('https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?auto=format&fit=crop&w=900&q=80', 'تشكيلة ألوان جاهزة للطباعة والتطريز')
) as v(image_url, caption)
where not exists (
  select 1 from public.gallery_images g where g.image_url = v.image_url
);

-- ⚠️ مهم: بعد إنشاء مستخدم الأدمن من لوحة Supabase
-- (Authentication > Users > Add user)، أضف إيميله هنا:
-- insert into public.admins (email) values ('admin@example.com');
