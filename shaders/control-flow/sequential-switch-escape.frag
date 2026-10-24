// Regression test for #318: multiple sequential switch modifications
// should iterate until done instead of aborting after a single SimpleModify pass.

cbuffer C : register(b0) { float4 k; uint mode; };

float4 main(float4 uv : TEXCOORD0) : SV_Target0
{
	float4 r = 0;
	uint pc = 0;
	[loop]
	while (true)
	{
		switch (pc)
		{
		case 0:
			if (uv.x > k.x) { pc = 2; continue; }
		case 1:
			pc = 3;
			continue;
		case 2:
			r = uv;
		case 3:
			switch (mode)
			{
			case 1: r = 0; break;
			case 2: r = r * r; break;
			default: break;
			}
			break;
		}
		break;
	}
	return r;
}
