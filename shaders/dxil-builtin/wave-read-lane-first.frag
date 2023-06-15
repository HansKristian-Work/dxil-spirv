RWByteAddressBuffer Buf : register(u0);

void main(uint3 index : INDEX)
{
	if (index.x == 40)
		discard;
	uint3 first_value = WaveReadLaneFirst(index);
	Buf.Store3(index.x * 12, first_value);
}
