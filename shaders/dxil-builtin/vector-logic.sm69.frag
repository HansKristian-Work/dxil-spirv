int4 main(int4 a : A, int4 b : B) : SV_Target
{
	bool4 cmp1 = a > 1;
	bool4 cmp2 = b < -1;
	bool4 cmp3 = a * b == 0;

	bool4 cmp4 = and(or(cmp1, cmp2), cmp3);

	int4 c = select(cmp4, a, b);

	bool b1 = any(cmp4);
	bool b2 = all(cmp4);

	return b1 && b2 ? c : 0;
}
