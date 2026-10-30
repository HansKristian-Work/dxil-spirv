RWStructuredBuffer<uint2> O : register(u0);

[numthreads(64, 1, 1)]
void main(uint i : SV_DispatchThreadID)
{
	O[i] = AddUint64(O[i], uint2(0xffffffff, 0));
}
