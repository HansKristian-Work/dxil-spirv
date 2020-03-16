Buffer<float4> uBuffer : register(t3);
Buffer<uint4> uBufferArray[64] : register(t4);
Buffer<int4> uBufferBindless[] : register(t100);

cbuffer CBUFFER : register(b0)
{
	uint index;
};

float3 main(float4 pos : SV_Position, nointerpolation uint dynamic_index : INDEX) : SV_Target
{
	int offset = int(pos.x);
	float4 result = uBuffer.Load(offset);
	result += uBufferArray[index].Load(offset);
	result += uBufferBindless[NonUniformResourceIndex(dynamic_index)].Load(offset);
	return result;
}
