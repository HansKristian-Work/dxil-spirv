Texture1D<float> Tex1D : register(t0, space1);
Texture1DArray<float> Tex1DArray : register(t1, space1);
Texture2D<float> Tex2D : register(t2, space1);
Texture2DArray<float> Tex2DArray : register(t3, space1);
TextureCube<float> TexCube : register(t5, space1);

SamplerComparisonState Samp : register(s0);

float main(float4 UV : TEXCOORD, float Dref : DREF) : SV_Target
{
	float res = 0.0;
	uint feedback;

	res += Tex1D.SampleCmpGrad(Samp, UV.x, Dref, UV.z, UV.w, 1, 0.0, feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += Tex1DArray.SampleCmpGrad(Samp, UV.xy, Dref, UV.z, UV.w, 2, 0.0, feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += Tex2D.SampleCmpGrad(Samp, UV.xy, Dref, UV.zz, UV.ww, int2(-3, -4), 0.0, feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;
	res += Tex2DArray.SampleCmpGrad(Samp, UV.xyz, Dref, UV.zz, UV.ww, int2(4, -5), 0.0, feedback);
	res += CheckAccessFullyMapped(feedback) ? 1 : 0;

	return res;
}
