Texture2D<float4> Tex2D : register(t3);

SamplerState Samp : register(s1);

float4 main(float4 UV : TEXCOORD, nointerpolation int2 off : OFF, int2 off2 : OFF2) : SV_Target
{
	float4 res = 0.0.xxxx;

	res += Tex2D.GatherRed(Samp, UV.xy, off, off + off2, off - off2, off2);

	return res;
}
