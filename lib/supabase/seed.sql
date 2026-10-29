-- ==============================================================================
-- NIGHTSHIFT EXPRESS - SEED DATA
-- Run after schema.sql to populate initial stores, products, and operational records
-- ==============================================================================

-- Insert Initial Stores
INSERT INTO public.stores (id, name, slug, category, description, commission_rate, rating, eta_range)
VALUES
  ('c0a80121-0000-0000-0000-000000000001', 'Tiger Noodle Club', 'tiger-noodle-club', 'Food', 'Late-night ramen, gyoza and savory night plates', 8.00, 4.9, '22–30 min'),
  ('c0a80121-0000-0000-0000-000000000002', 'Brew After Dark', 'brew-after-dark', 'Drinks', 'Cold brews, tonics and iced espresso', 8.00, 4.8, '18–25 min'),
  ('c0a80121-0000-0000-0000-000000000003', 'Care & Co. Pharmacy', 'care-and-co-pharmacy', 'Pharmacy', 'Verified nighttime pharmacy and first aid', 8.00, 4.9, '20–28 min'),
  ('c0a80121-0000-0000-0000-000000000004', 'Night Pantry', 'night-pantry', 'Groceries', 'Quick pantry essentials, crisps and snacks', 8.00, 4.7, '18–24 min'),
  ('c0a80121-0000-0000-0000-000000000005', 'Corner Stop Market', 'corner-stop-market', 'Smoking', 'Licensed night supplies · 18+ verification', 8.00, 4.6, '20–28 min'),
  ('c0a80121-0000-0000-0000-000000000006', 'Trackside Fuel', 'trackside-fuel', 'Sports Cravings', 'Electrolytes, protein bars and recovery drinks', 8.00, 4.8, '18–24 min')
ON CONFLICT (slug) DO NOTHING;

-- Insert Products
INSERT INTO public.products (store_id, name, description, category, price, stock, eta, rating, badge, age_restricted)
VALUES
  ('c0a80121-0000-0000-0000-000000000001', 'Spicy miso ramen', 'Slow-braised beef · spring onion · chilli oil', 'Food', 420.00, 24, '22–30 min', 4.9, 'Night favourite', false),
  ('c0a80121-0000-0000-0000-000000000001', 'Comfort food combo', 'Ramen, gyoza and a little extra chilli crisp', 'Food', 620.00, 15, '25–35 min', 4.9, NULL, false),
  ('c0a80121-0000-0000-0000-000000000001', 'Gyoza · six pieces', 'Crispy pan-seared chicken dumplings with sesame dip', 'Food', 280.00, 18, '15–22 min', 4.8, 'Popular side', false),
  ('c0a80121-0000-0000-0000-000000000001', 'Chilli crisp jar', 'House-blend artisanal crunchy chilli oil', 'Food', 120.00, 30, '15–20 min', 4.9, NULL, false),
  ('c0a80121-0000-0000-0000-000000000002', 'Cold brew tonic', 'Double-shot coffee · citrus · plenty of ice', 'Drinks', 260.00, 20, '18–25 min', 4.8, 'Low stock', false),
  ('c0a80121-0000-0000-0000-000000000003', 'Late-night relief kit', 'Everyday essentials from a verified pharmacy', 'Pharmacy', 190.00, 45, '20–28 min', 4.9, 'Verified', false),
  ('c0a80121-0000-0000-0000-000000000004', 'The snack stash', 'Crisps, chocolate and something for tomorrow', 'Groceries', 380.00, 25, '18–24 min', 4.7, NULL, false),
  ('c0a80121-0000-0000-0000-000000000005', 'Classic cigarette pack', 'Age verification required at delivery', 'Smoking', 280.00, 40, '20–28 min', 4.6, NULL, true),
  ('c0a80121-0000-0000-0000-000000000006', 'Protein bar duo', 'Two bars · 20g protein · no late-night slump', 'Sports Cravings', 220.00, 35, '20–28 min', 4.8, 'Post-session', false),
  ('c0a80121-0000-0000-0000-000000000006', 'After-hours hydration', 'Electrolyte drink · cold and ready to go', 'Sports Cravings', 160.00, 50, '18–24 min', 4.7, NULL, false);
