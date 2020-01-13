RWTexture2D<float4> Tex[] : register(u0, space0);
RWTexture2D<float4> Tex2[100] : register(u0, space1);

float4 main(nointerpolation uint index : INDEX) : SV_Target
{
	return
		Tex[index].Load(int2(0, 0)) +
		Tex2[index ^ 1].Load(int2(0, 0));
}
