CREATE POLICY "Consumers can insert their own loyalty profile" 
ON public.loyalty_members
FOR INSERT 
WITH CHECK (true);
