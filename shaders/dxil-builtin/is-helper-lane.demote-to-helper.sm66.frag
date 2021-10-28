float4 main(float2 UV : TEXCOORD) : SV_Target
{
	if (UV.x > 10.0)
		discard;
	else if (UV.y > 20.0)
		discard;

	float4 res = 0.0.xxxx;
	if (!IsHelperLane())
		res = WavePrefixSum(float4(UV, UV * UV));
	return res;
}
