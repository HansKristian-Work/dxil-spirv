uint4 main(uint4 a : A, uint4 b : B, uint4 c : C) : SV_Target
{
	uint4 t1 = a + b / c;
	uint4 t2 = mad(a, b, c);

	uint4 t3 = sqrt(abs(t1));
	uint4 t4 = cos(normalize(t2));

	uint4 t7 = min(t3, t4);

	return t7;
}
