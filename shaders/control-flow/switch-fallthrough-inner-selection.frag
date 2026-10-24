// Regression test for #319: switch fallthrough containing inner conditional branch
// should not treat the inner conditional body as a selection merge target.

Texture2D t : register(t0);
SamplerState s : register(s0);
cbuffer C : register(b0) { uint flags; uint mode; float m; };

float curve(float x)
{
	float a = 1.0, b = 0.0;
	if (x >= 0.25) { a = 2.0; b = -0.5; }
	return x * a + b;
}

float4 decode(float4 c)
{
	if ((flags & 1) == 0)
		return c;
	return float4(curve(c.x), c.yzw);
}

float scaleA(float a)
{
	switch (mode)
	{
	case 1: return a * m;
	default: return a;
	}
}

float4 main(float4 uv : TEXCOORD0, float4 v : TEXCOORD1, float4 w : TEXCOORD2) : SV_Target0
{
	float4 o = 0;
	float4 c = 0;
	float x = 0;
	bool p = false;
	uint pc = 0;
	[loop]
	while (true)
	{
		switch (pc)
		{
		case 0:
			p = (flags & 2) != 0;
			c = decode(v);
		case 1:
			if (!p)
				x = clamp(rcp(w.z), -3.4e38, 3.4e38);
			pc = 3;
			continue;
		case 3:
			o.xyz = c.xyz;
			o.w = scaleA(x);
		}
		break;
	}
	return o;
}
