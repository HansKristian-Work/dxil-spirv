RWByteAddressBuffer Buf : register(u0);

void main(uint index : INDEX)
{
	if (index == 40)
		discard;
	bool2 all_equal = WaveActiveAllEqual(float2(index, index + 1));
	if (all_equal.x)
		Buf.Store(index * 4, 1);
}
