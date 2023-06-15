RWByteAddressBuffer Buf : register(u0);

void main(uint index : INDEX)
{
	if (index == 40)
		discard;

	bool all_true = WaveActiveAllTrue(index < 100);
	if (all_true)
		Buf.Store(index * 4, 1);
}
