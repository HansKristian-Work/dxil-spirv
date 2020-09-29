StructuredBuffer<float> uBuffer : register(t3);
StructuredBuffer<float2> uBufferArray[64] : register(t4);
StructuredBuffer<float3> uBufferBindless[] : register(t100);

cbuffer CBUFFER : register(b0)
{
	uint index;
};

float3 main(float4 pos : SV_Position, nointerpolation uint dynamic_index : INDEX) : SV_Target
{
	int offset = int(pos.x);
	float3 result = uBuffer.Load(offset);
	result += uBufferArray[index].Load(offset).xyx;
	result += uBufferBindless[NonUniformResourceIndex(dynamic_index)].Load(offset);
	return result;
}
