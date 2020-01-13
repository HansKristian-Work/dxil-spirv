Texture2D<float4> Tex : register(t0, space0);
SamplerState Samp[] : register(s0, space0);
SamplerState Samp2[100] : register(s0, space1);

float4 main() : SV_Target
{
	return
		Tex.Sample(Samp[2], 0.5.xx) +
		Tex.Sample(Samp2[3], 0.5.xx);
}
