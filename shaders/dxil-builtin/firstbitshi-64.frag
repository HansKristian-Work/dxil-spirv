int main(uint a : A, uint b : B) : SV_Target
{
	int64_t c = int64_t((uint64_t(b) << 32) | a);
	return firstbithigh(c);
}
