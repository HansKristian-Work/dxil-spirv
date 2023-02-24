RasterizerOrderedByteAddressBuffer RW : register(u0);

[earlydepthstencil]
void main(float4 pos : SV_Position)
{
	uint2 coord = uint2(pos.xy);
	uint offset = 16 * (coord.y * 1000 + coord.x);
	RW.Store4(offset, RW.Load4(offset) + uint4(1, 2, 3, 4));
}
