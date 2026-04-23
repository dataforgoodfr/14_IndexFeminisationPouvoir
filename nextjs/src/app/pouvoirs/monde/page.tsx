import { BlocClassement } from '@/components/BlocClassement';
import { GoodBadExample, GoodBadTitle } from '@/components/GoodBadExample';

export default function Page() {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-x-8 gap-y-10 px-5 md:px-25 py-11 bg-foundations-blanc items-stretch justify-center">
        <div className="flex-1 min-w-0">
      <GoodBadExample
        variant="good"
        className="h-full"
      >
        <GoodBadTitle variant="good" title="tmp" />
            <BlocClassement data={[{
              label: '',
              percentage: 0
            }, {
                label: '',
                percentage: 0
              }, {
                label: '',
                percentage: 0
              }, {
                label: '',
                percentage: 0
              }]} title={'title'} description={'description'} />
      </GoodBadExample>
      <GoodBadExample
        variant="bad"
        className="h-full"
      >
        <GoodBadTitle variant="bad" title="tmp" />
            <BlocClassement data={[{
              label: '',
              percentage: 0,
              evolution: -1
            }, {
                label: '',
                percentage: -20

              }, {
                label: '',
                percentage: -20
              }, {
                label: '',
                percentage:  -2
              }]} title={'title'} description={'description'}/>
      </GoodBadExample>
      </div></div>
    </div>
  );
}
