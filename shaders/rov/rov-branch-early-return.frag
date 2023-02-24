RasterizerOrderedTexture2D<float4> RW0 : register(u0);
RasterizerOrderedTexture2D<float4> RW1 : register(u1);
RWTexture2D<float4> RW2 : register(u2);

[earlydepthstencil]
void main(float4 pos : SV_Position)
{
	uint2 coord = uint2(pos.xy);

	RW2[coord] += float4(1, 2, 3, 4);

	[branch]
	if (pos.x < 10.0)
	{
		RW0[coord] += float4(1, 2, 3, 4);
		if (RW2[coord].z > 100.0)
			return;
	}
	else
		RW1[coord] += float4(1, 2, 3, 4);

	RW2[coord ^ 1] += float4(1, 2, 3, 4);
}

