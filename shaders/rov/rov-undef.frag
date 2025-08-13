RasterizerOrderedByteAddressBuffer RW : register(u0);

[earlydepthstencil]
void main(float4 pos : SV_Position)
{
	bool v = pos.x > 1000.0;
	bool v2 = pos.x > 1100.0;

	uint2 coord;

	[branch]
	if (v)
	{
		coord = uint2(pos.xy);
		coord = RW.Load2(0);
		RW.Store(0, 50);
	}

	[branch]
	if (v2)
	{
		uint offset = 16 * (coord.y * 1000 + coord.x);
		RW.Store4(offset, RW.Load4(offset) + uint4(1, 2, 3, 4));
	}
}
