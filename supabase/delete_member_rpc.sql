-- SQL Script to enable loyalty member deletion

-- 1. Create a function to delete a loyalty member by ID, bypassing RLS
CREATE OR REPLACE FUNCTION public.delete_loyalty_member(p_member_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Perform the delete operation
  DELETE FROM public.loyalty_members
  WHERE id = p_member_id;

  -- Return true if successful
  RETURN FOUND;
END;
$$;
