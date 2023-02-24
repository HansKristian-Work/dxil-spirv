RasterizerOrderedTexture2D<float4> RW0 : register(u0);
RasterizerOrderedTexture2D<float4> RW1 : register(u1);
RWTexture2D<float4> RW2 : register(u2);

[earlydepthstencil]
float main(float4 pos : SV_Position) : SV_Target
{
	uint2 coord = uint2(pos.xy);
	// Make sure OpVariable move works for fallback.
	float V[8];
	uint i;
	for (i = 0; i < 8; i++)
		V[i] = float(i);

	RW2[coord] += float4(1, 2, 3, 4);

	[loop]
	for (i = 0; i < 4; i++)
	{
		RW0[coord] += float4(1, 2, 3, 4);
		V[i] = RW0[coord].y;
	}

	return V[uint(pos.w * 7.0)];
}
