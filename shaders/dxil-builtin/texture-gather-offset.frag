Texture2D<float4> Tex2D : register(t3);
Texture2DArray<float4> Tex2DArray : register(t4);

SamplerState Samp : register(s1);

float4 main(float4 UV : TEXCOORD) : SV_Target
{
	float4 res = 0.0.xxxx;

	res += Tex2D.Gather(Samp, UV.xy, int2(1, 2));
	res += Tex2DArray.GatherGreen(Samp, UV.xyz, int2(-2, -3));

	return res;
}
