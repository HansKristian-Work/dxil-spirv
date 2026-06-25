float2 main(float2 v : V, nointerpolation uint index : INDEX) : SV_Target
{
	float2 res;
	res = QuadReadLaneAt(v, 2);
	res += QuadReadLaneAt(v, index);
	return res;
}
