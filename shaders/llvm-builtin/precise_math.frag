precise float main(float a : A, float b : B, float c : C) : SV_Target
{
	precise float tmp;
	tmp = a * b + c;
	tmp += a;
	tmp -= b;
	tmp *= c;
	return tmp;
}
