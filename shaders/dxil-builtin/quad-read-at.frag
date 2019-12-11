float2 main(float v : V, nointerpolation uint index : INDEX) : SV_Target
{
	float2 res;
	res.x = QuadReadLaneAt(v, 2);
	res.y = QuadReadLaneAt(v, index);
	return res;
}
