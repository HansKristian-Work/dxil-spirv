struct Half8 { float16_t4 lo; float16_t4 hi; };
struct Int16x8 { int16_t4 lo; int16_t4 hi; };

cbuffer Cbuf : register(b0, space1)
{
	float4 a;
	Half8 b;
	Int16x8 c;
	int64_t d;
	double e;
};

float4 main() : SV_Target
{
	Half8 half8 = b;
	Int16x8 int16x8 = c;
	return a
		+ float4(half8.lo)
		+ float4(half8.hi)
		+ float4(c.lo)
		+ float4(c.hi)
		+ float(d)
		+ float(e)
		;
}
