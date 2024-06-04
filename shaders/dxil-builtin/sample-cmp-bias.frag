Texture1D<float> Tex1D : register(t0, space1);
Texture1DArray<float> Tex1DArray : register(t1, space1);
Texture2D<float> Tex2D : register(t2, space1);
Texture2DArray<float> Tex2DArray : register(t3, space1);
TextureCube<float> TexCube : register(t5, space1);

SamplerComparisonState Samp : register(s0);

float main(float4 UV : TEXCOORD, float Dref : DREF) : SV_Target
{
	float res = 0.0;

	res += Tex1D.SampleCmpBias(Samp, UV.x, Dref, UV.w);
	res += Tex1DArray.SampleCmpBias(Samp, UV.xy, Dref, UV.w);
	res += Tex2D.SampleCmpBias(Samp, UV.xy, Dref, UV.w);
	res += Tex2DArray.SampleCmpBias(Samp, UV.xyz, Dref, UV.w);
	res += TexCube.SampleCmpBias(Samp, UV.xyz, Dref, UV.w);

	return res;
}
