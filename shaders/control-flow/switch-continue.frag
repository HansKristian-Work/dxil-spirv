float main(int4 i : I) : SV_Target
{
	[loop]
	for (;;)
	{
		switch (i.x)
		{
			case 5:
				i.x++;
				i = i.yzwx;
				continue;

			case 7:
				i.x += 10;
				i = i.yzwx;
				continue;

			default:
				break;
		}

		i = i.yzwx;
		break;
	}

	return float(i.x + i.y);
}
