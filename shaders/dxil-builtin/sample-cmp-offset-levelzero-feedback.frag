Texture1D<float2> Tex1D : register(t0, space1);
Texture1DArray<float> Tex1DArray : register(t1, space1);
Texture2D<float2> Tex2D : register(t2, space1);
Texture2DArray<float> Tex2DArray : register(t3, space1);
Texture3D<float2> Tex3D : register(t4, space1);
TextureCube<float2> TexCube : register(t5, space1);
TextureCubeArray<float> TexCubeArray : register(t6, space1);

SamplerComparisonState Samp : register(s0);

float2 main(float4 UV : TEXCOORD) : SV_Target
{
	float2 res = 0.0.xx;
	uint feedback;

	res += Tex1D.SampleCmpLevelZero(Samp, UV.x, UV.w, 1, feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += Tex1DArray.SampleCmpLevelZero(Samp, UV.xy, UV.w, 2, feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += Tex2D.SampleCmpLevelZero(Samp, UV.xy, UV.w, int2(-3, -2), feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += Tex2DArray.SampleCmpLevelZero(Samp, UV.xyz, UV.w, int2(4, 5), feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;

	return res;
}
