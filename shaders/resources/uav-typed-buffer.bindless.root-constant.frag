RWBuffer<float4> uBuffer : register(u3);
RWBuffer<uint4> uBufferArray[64] : register(u4);
RWBuffer<int4> uBufferBindless[] : register(u100);

cbuffer CBUFFER : register(b0)
{
	uint index;
};

float4 main(float4 pos : SV_Position, nointerpolation uint dynamic_index : INDEX) : SV_Target
{
	int offset = int(pos.x);
	float4 result = uBuffer.Load(offset);
	result += uBufferArray[index].Load(offset);
	result += uBufferBindless[NonUniformResourceIndex(dynamic_index)].Load(offset);
	return result;
}
