RWByteAddressBuffer Buf : register(u0);

void main(uint index : INDEX)
{
	if (index == 40)
		discard;

	uint value = WaveActiveCountBits(index < 100);
	Buf.Store(index * 4, value);
}
