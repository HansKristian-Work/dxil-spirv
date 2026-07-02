float4 main(float4 a : A) : SV_Target
{
	float4 r;
	r = a;
	r += QuadReadAcrossX(a);
	r += QuadReadAcrossY(a);
	r += QuadReadAcrossDiagonal(a);
	return r;
}
