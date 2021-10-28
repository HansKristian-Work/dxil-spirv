float4 main(float2 UV : TEXCOORD) : SV_Target
{
	float4 res = 0.0.xxxx;
	if (!IsHelperLane())
		res = WavePrefixSum(float4(UV, UV * UV));
	return res;
}
