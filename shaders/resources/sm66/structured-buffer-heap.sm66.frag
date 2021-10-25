float4 main(uint index : INDEX, int4 uv : UV) : SV_Target
{
	StructuredBuffer<float > RO1 = ResourceDescriptorHeap[index + 0];
	StructuredBuffer<float2> RO2 = ResourceDescriptorHeap[index + 1];
	StructuredBuffer<float3> RO3 = ResourceDescriptorHeap[index + 2];
	StructuredBuffer<float4> RO4 = ResourceDescriptorHeap[index + 3];

	RWStructuredBuffer<float > RW1 = ResourceDescriptorHeap[index + 4];
	RWStructuredBuffer<float2> RW2 = ResourceDescriptorHeap[index + 5];
	RWStructuredBuffer<float3> RW3 = ResourceDescriptorHeap[index + 6];
	RWStructuredBuffer<float4> RW4 = ResourceDescriptorHeap[index + 7];

	globallycoherent RWStructuredBuffer<float > RWC1 = ResourceDescriptorHeap[index + 8];
	globallycoherent RWStructuredBuffer<float2> RWC2 = ResourceDescriptorHeap[index + 9];
	globallycoherent RWStructuredBuffer<float3> RWC3 = ResourceDescriptorHeap[index + 10];
	globallycoherent RWStructuredBuffer<float4> RWC4 = ResourceDescriptorHeap[index + 11];

	float4 res = 0.0.xxxx;
	res.x += RO1[uv.x];
	res.xy += RO2[uv.y];
	res.xyz += RO3[uv.z];
	res += RO4[uv.w];

	res.x += RW1[uv.x];
	res.xy += RW2[uv.y];
	res.xyz += RW3[uv.z];
	res += RW4[uv.w];

	res.x += RWC1[uv.x];
	res.xy += RWC2[uv.y];
	res.xyz += RWC3[uv.z];
	res += RWC4[uv.w];

	RW2[uv.x] = 20.0;
	RWC3[uv.y] = 30.0;

	return res;
}
