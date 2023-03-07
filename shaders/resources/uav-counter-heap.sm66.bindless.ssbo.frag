float4 main(uint i : I) : SV_Target
{
	RWStructuredBuffer<float4> A = ResourceDescriptorHeap[14];
	uint v = A.IncrementCounter();
	return A[v];
}
