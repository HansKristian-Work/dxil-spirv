float main(float2 a : A) : SV_Target
{
	return min(a.x, a.y);
}
