int main(nointerpolation int3 a : A) : SV_Target
{
	return mad(a.x, a.y, a.z);
}
