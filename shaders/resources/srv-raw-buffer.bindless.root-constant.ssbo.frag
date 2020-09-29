ByteAddressBuffer uBuffer : register(t3);
ByteAddressBuffer uBufferArray[64] : register(t4);
ByteAddressBuffer uBufferBindless[] : register(t100);

cbuffer CBUFFER : register(b0)
{
	uint index;
};

uint2 main(float4 pos : SV_Position, nointerpolation uint dynamic_index : INDEX) : SV_Target
{
	int offset = int(pos.x) * 8;
	uint2 result = uBuffer.Load2(offset);
	result += uBufferArray[index].Load2(offset);
	result += uBufferBindless[NonUniformResourceIndex(dynamic_index)].Load2(offset);
	return result;
}
