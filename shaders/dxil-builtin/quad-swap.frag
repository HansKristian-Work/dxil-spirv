float4 main(float a : A) : SV_Target
{
	float4 r;
	r.x = a;
	r.y = QuadReadAcrossX(a);
	r.z = QuadReadAcrossY(a);
	r.w = QuadReadAcrossDiagonal(a);
	return r;
}
