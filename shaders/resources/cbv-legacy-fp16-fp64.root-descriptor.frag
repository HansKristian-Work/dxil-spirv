struct Half8 { min16float4 lo; min16float4 hi; };

cbuffer Cbuf
{
	float4 a;
	Half8 b;
	int64_t4 c;
};

float4 main() : SV_Target
{
	Half8 half8 = b;
	return a + float4(half8.lo) + float4(half8.hi) + float4(c);
}
