RasterizerOrderedTexture2DArray<float4> RW : register(u0);

[earlydepthstencil]
void main(float4 pos : SV_Position)
{
	uint3 coord = uint3(pos.xyz);
	RW[coord] += float4(1.0, 2.0, 3.0, 4.0);
}
