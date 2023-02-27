RasterizerOrderedTexture2D<float4> RW0 : register(u0);
RasterizerOrderedTexture2D<float4> RW1 : register(u1);
RWTexture2D<float4> RW2 : register(u2);

[earlydepthstencil]
void main(float4 pos : SV_Position)
{
	uint2 coord = uint2(pos.xy);

	[loop]
	for (uint i = 0; i < 4; i++)
		RW2[coord] += float4(1, 2, 3, 4);

	RW0[coord] += float4(1, 2, 3, 4);
}
