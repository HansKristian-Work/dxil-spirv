RWStructuredBuffer<float2> RWStructuredBuf : register(u0);
RWStructuredBuffer<float2> RWStructuredBuf2 : register(u1);

uint main() : SV_Target
{
	uint v = RWStructuredBuf.IncrementCounter();
	v += RWStructuredBuf2.DecrementCounter();
	return v;
}
