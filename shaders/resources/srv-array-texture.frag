Texture2D<float4> Tex[] : register(t0, space0);
Texture2D<float4> Tex2[100] : register(t0, space1);
SamplerState Samp : register(s0);

float4 main(nointerpolation uint index : INDEX) : SV_Target
{
	return
		Tex[index].Sample(Samp, 0.5.xx) +
		Tex2[index ^ 1].Sample(Samp, 0.5.xx);
}
