RWStructuredBuffer<uint> Blah[5] : register(u10);

uint main(uint i : I) : SV_Target
{
	return Blah[NonUniformResourceIndex(i)].IncrementCounter();
}
