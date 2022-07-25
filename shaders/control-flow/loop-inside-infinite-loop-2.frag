StructuredBuffer<uint> RO : register(t0);
RWStructuredBuffer<uint> RW : register(u0);

void inc(inout uint v)
{
	uint ov;
	InterlockedAdd(RW[0], v, v);
	v = ov;
}

float4 inner_main(uint4 v)
{
	for (;;)
	{
		inc(v.x);
		for (int i = 0; i < v.y; i++)
		{
			if (v.x & 3)
				return float4(v);
			if (v.x & 7)
				break;
			inc(v.x);
		}
		inc(v.x);
		v.x++;
	}
	return float4(v);
}

float4 main(uint4 v : V) : SV_Target
{
	float4 ov;
	[branch]
	if (v.x < 10)
	{
		ov = inner_main(v);
	}
	else
	{
		ov = inner_main(~v);
		//ov = 0.0.xxxx;
	}
	return ov;
}
