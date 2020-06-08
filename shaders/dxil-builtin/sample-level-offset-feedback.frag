Texture1D<float2> Tex1D : register(t0, space1);
Texture1DArray<float> Tex1DArray : register(t1, space1);
Texture2D<float2> Tex2D : register(t2, space1);
Texture2DArray<float> Tex2DArray : register(t3, space1);
Texture3D<float2> Tex3D : register(t4, space1);
TextureCube<float2> TexCube : register(t5, space1);
TextureCubeArray<float> TexCubeArray : register(t6, space1);

SamplerState Samp : register(s0);

float2 main(float4 UV : TEXCOORD) : SV_Target
{
	float2 res = 0.0.xx;
	uint feedback;

	res += Tex1D.SampleLevel(Samp, UV.x, UV.w, 1, feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += Tex1DArray.SampleLevel(Samp, UV.xy, UV.w, 2, feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += Tex2D.SampleLevel(Samp, UV.xy, UV.w, float2(2, 3), feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += Tex2DArray.SampleLevel(Samp, UV.xyz, UV.w, float2(-1, -3), feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += Tex3D.SampleLevel(Samp, UV.xyz, UV.w, float3(-4, -5, 3), feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;

	return res;
}
