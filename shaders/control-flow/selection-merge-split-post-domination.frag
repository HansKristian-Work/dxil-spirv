float4 main(float4 v : V) : SV_Target
{
	float4 res = 0.0.xxxx;
	[branch]
	if (v.x > 0.0)
	{
		res.x = 10.0;
	}

	[branch]
	if (v.y > 0.0)
	{
		res.y = 20.0;
		[branch]
		if (v.x > 1.0)
			res.y = 10.0;

		[branch]
		if (v.z > 0.0)
		{
			res.w = 20.0;
		}
	}

	res += 10.0;
	return res;
}
