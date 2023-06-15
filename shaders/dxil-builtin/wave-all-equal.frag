RWByteAddressBuffer Buf : register(u0);

void main(uint index : INDEX)
{
	if (index == 40)
		discard;
	bool all_equal = WaveActiveAllEqual(index);
	if (all_equal)
		Buf.Store(index * 4, 1);
}
